<script setup lang="ts">
const { customer } = useCustomer()
const { customerSetting } = useCustomerSetting()
</script>

<template>
  <div v-if="customerSetting?.accessSource" class="access-map">
    <iframe
      :src="customerSetting.accessSource"
      style="border: 0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      class="map"
    />
    <div v-if="customer" class="address">
      <div>
        <p>〒 {{ customer.zip }}</p>
        <p>{{ customer.address }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.access-map {
  iframe.map {
    width: 100%;
    aspect-ratio: 16/9;
    margin-top: 0.5rem;
    background-color: lightgray;
  }
  .address {
    margin-top: 1rem;
    margin-left: 2rem;
  }
  @media only screen and (max-width: $grid-breakpoint-md) {
    .address {
      margin-top: 0.75rem;
      margin-left: 0.5rem;
    }
  }
}
</style>
