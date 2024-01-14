<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#2a83ff',
        sizeStep: 4,
        sizeUnit: 2,
        borderRadius: 8,
        wireframe: false,
      },
    }">
    <router-view></router-view>
  </a-config-provider>
</template>
