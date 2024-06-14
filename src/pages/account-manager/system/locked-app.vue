<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>
    <div class="account-manager-transparent-card">
      <a-flex align="center" justify="space-between">
        <h3 class="text-white fs-1">Tạm khoá ứng dụng</h3>

        <ConfirmModal
          v-if="countdownTime && userProfile"
          buttonShape="round"
          :buttonDanger="true"
          buttonType="primary"
          title="Bạn có chắc muốn kết thúc sớm thời gian khoá?"
          :confirm="endCountDown">
          <template #buttonContent> Kết thúc sớm</template>
        </ConfirmModal>
      </a-flex>
      <a-flex align="center" justify="space-between">
        <p class="mt-2 text-white">
          Trong thời gian tạm khoá, tất cả người dùng không được cấp phếp đều sẽ không thể đăng nhập vào ứng dụng.
        </p>
      </a-flex>
    </div>
    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-skeleton :loading="contentLoading" active>
          <a-form
            v-if="!countdownTime"
            class="white-text-form"
            layout="vertical"
            :model="formModel"
            name="formName"
            :rules="rules"
            ref="formRef"
            hideRequiredMark>
            <a-form-item class="mt-3" name="lockedTime">
              <template #label>
                <p class="fw-bold text-white">Thời gian khoá</p>
                <a-tooltip overlayClassName="tool-container-tooltip" placement="topLeft">
                  <template #title>
                    <p class="text-white">
                      Thời gian bắt đầu phải lơn hơn hoặc bằng thời gian hiện tại, thời gian kết thúc khoá phải lớn hơn
                      thời gian bắt đầu. (Múi giờ UTC+07:00)
                    </p>
                  </template>
                  <i class="fa-solid fa-circle-exclamation text-white ms-2"></i>
                </a-tooltip>
              </template>
              <a-range-picker
                v-model:value="formModel.lockedTime"
                show-time
                :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
                size="large" />
            </a-form-item>

            <a-flex align="center" justify="right">
              <a-button @click="lockedConfirm" size="large" shape="round">Khoá ứng dụng</a-button>
            </a-flex>
          </a-form>

          <a-row v-if="countdownTime">
            <a-col :flex="2">
              <p v-if="title == 'start'" class="fw-bold fs-6">Đếm ngược bắt đầu khoá:</p>
              <p v-else-if="title == 'end'" class="fw-bold fs-6">Thời gian khoá còn lại:</p>
            </a-col>

            <a-col :flex="12">
              <a-row justify="space-around">
                <span class="countdown-item">
                  <span> {{ countDays }} </span>
                  Ngày
                </span>
                <span class="countdown-item">
                  <span> {{ countHours }} </span>
                  Giờ
                </span>
                <span class="countdown-item">
                  <span> {{ countMinutes }} </span>
                  Phút
                </span>
                <span class="countdown-item">
                  <span> {{ countSeconds }}</span>
                  Giây
                </span>
              </a-row>
            </a-col>
          </a-row>
        </a-skeleton>
      </a-skeleton>
    </a-card>
  </a-flex>
</template>

<script>
import { defineComponent, ref, inject, reactive, toRefs } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { userState } from '@/stores/user-state';
import { getItem } from '@/js/utils/localStorage.js';
import { addLeadingZero } from '@/js/utils/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
import ConfirmModal from '@/components/interface/confirm-modal.vue';

export default defineComponent({
  components: {
    ConfirmModal,
  },

  setup() {
    const pageLoading = inject('pageLoading');
    const contentLoading = ref(true);
    const userProfile = inject('userProfile');
    const countdownTime = ref();
    const title = ref();

    const dateValidator = async (_rule, value) => {
      const currentDate = dayjs();
      if (!value[0] || !value[1]) {
        return Promise.reject('Ngày không hợp lệ.');
      } else if (value[0] < currentDate || value[1] < currentDate) {
        return Promise.reject('Thời gian bắt đầu hoặc thời gian kết thúc phải lớn hơn thời gian hiện tại.');
      } else {
        return Promise.resolve('');
      }
    };

    const getLockedTime = () => {
      contentLoading.value = true;
      thuyLoiApi
        .get(`/system/locked-times/locked-time`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          const { lockedTime } = response.data;
          const currentTime = dayjs();
          if (lockedTime) {
            formModel.timeId = lockedTime.id;
            if (dayjs(lockedTime.start_time) > currentTime) {
              countdownTime.value = lockedTime;
              title.value = 'start';
              startCountdown(dayjs(countdownTime.value.start_time));
            } else if (dayjs(lockedTime.end_time) > currentTime) {
              countdownTime.value = lockedTime;
              title.value = 'end';
              startCountdown(dayjs(countdownTime.value.end_time));
            }
          }

          contentLoading.value = false;
        })
        .catch((error) => {
          contentLoading.value = false;
          console.log(error);
        });
    };
    getLockedTime();

    const formRef = ref();
    const formModel = reactive({
      timeId: '',
      lockedTime: [],
    });

    const rules = {
      lockedTime: [
        {
          validator: dateValidator,
          trigger: ['change', 'blur'],
        },
      ],
    };

    const countDays = ref();
    const countHours = ref();
    const countMinutes = ref();
    const countSeconds = ref();
    const timerInterval = ref();
    function startCountdown(targetDate) {
      function updateCountdown() {
        const now = dayjs();
        const duration = dayjs.duration(targetDate.diff(now));

        if (duration.asMilliseconds() <= 0) {
          countdownTime.value = '';
          title.value = '';
          getLockedTime();
          clearInterval(timerInterval.value);
          return;
        }

        countDays.value = addLeadingZero(Math.floor(duration.asDays()));
        countHours.value = addLeadingZero(Math.floor(duration.asHours() % 24));
        countMinutes.value = addLeadingZero(Math.floor(duration.asMinutes() % 60));
        countSeconds.value = addLeadingZero(Math.floor(duration.asSeconds() % 60));
      }

      updateCountdown();
      timerInterval.value = setInterval(updateCountdown, 1000);
    }

    return {
      pageLoading,
      contentLoading,
      userProfile,
      countdownTime,
      formRef,
      rules,
      formModel,
      countDays,
      countHours,
      countMinutes,
      countSeconds,
      startCountdown,
      timerInterval,
      title,
    };
  },

  data() {
    return {};
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          //   this.getReports();
          // this.dataSource.users[0];
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {
    loginState() {
      return userState().getLogin;
    },
  },

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-page' });
    },

    lockedConfirm() {
      this.formRef
        .validate()
        .then((response) => {
          this.contentLoading = true;
          thuyLoiApi
            .post(
              `/system/locked-times/create`,
              {
                // Đổi format để phù hợp với DB ở server
                // Để origin gửi lên server nó gặp vấn đề về timezone
                start_time: this.formModel.lockedTime[0].tz('Asia/Ho_Chi_Minh').format(),
                end_time: this.formModel.lockedTime[1].tz('Asia/Ho_Chi_Minh').format(),
              },
              {
                headers: {
                  Authorization: `Bearer ${getItem('accessToken')}`,
                },
              },
            )
            .then((response) => {
              // console.log(response.data);

              const { lockedTime } = response.data;
              this.formModel.timeId = lockedTime.id;

              const currentTime = dayjs();
              if (dayjs(lockedTime.start_time) > currentTime) {
                this.countdownTime = lockedTime;
                this.title = 'start';
                this.startCountdown(dayjs(this.countdownTime.start_time));
              } else if (dayjs(lockedTime.end_time) > currentTime) {
                this.countdownTime = lockedTime;
                this.title = 'end';
                this.startCountdown(dayjs(this.countdownTime.end_time));
              }

              this.$message.success('Yêu cầu khoá ứng dụng thành công.');

              this.contentLoading = false;
            })
            .catch((error) => {
              console.log(error);
              this.$message.error('Yêu cầu khoá ứng dụng thất bại. Vui lòng thử lại sau.');

              this.contentLoading = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    endCountDown() {
      this.contentLoading = true;
      thuyLoiApi
        .put(
          `/system/locked-times/${this.formModel.timeId}/end-early`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getItem('accessToken')}`,
            },
          },
        )
        .then((response) => {
          // console.log(response.data);
          this.countdownTime = '';
          this.formModel.lockedTime = [];
          this.formModel.timeId = '';
          clearInterval(this.timerInterval);
          this.$message.success('Yêu cầu kết thúc sớm thành công.');
          this.contentLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error('Yêu cầu kết thúc sớm thất bại. Vui lòng thử lại sau.');
          this.contentLoading = false;
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.countdown-item {
  font-size: 1.4rem;
  font-weight: bold;
  & * {
    font-size: 2rem;
    padding: 0.8rem;
    border: 1px solid #fff;
    border-radius: 0.4rem;
  }
}
</style>
