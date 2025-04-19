<template>
  <div class="loader">
    <div class="txt">Loading</div>
    <div class="spin alpha"></div>
    <div class="spin beta"></div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}
.loader > .spin {
  border: solid 7px color-mix(in srgb, currentColor 25%, transparent);
  border-radius: 100%;
  position: absolute;
  box-shadow: 0px 0px 2px 2px color-mix(in srgb, currentColor 25%, transparent);
}
.spin.alpha {
  width: 140px;
  height: 140px;
  top: -75px;
  left: -75px;
  animation: rotOuter 2.5s infinite linear;
}
.spin.beta {
  width: 120px;
  height: 120px;
  top: -65px;
  left: -65px;
  animation: rotInner 1.5s infinite linear;
}
.loader .txt {
  position: absolute;
  width: 180px;
  line-height: 180px;
  top: -90px;
  left: -90px;
  font-family: sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  animation: ini-scaleout 1.5s infinite linear;
}
@keyframes rotInner {
  0% {
    -webkit-transform: rotateY(-0deg) rotateX(30deg);
  }
  50% {
    -webkit-transform: rotateY(-180deg) rotateX(210deg);
  }
  100% {
    -webkit-transform: rotateY(-360deg) rotateX(390deg);
  }
}
@keyframes rotOuter {
  0% {
    -webkit-transform: rotateY(0deg) rotateX(30deg);
  }
  50% {
    -webkit-transform: rotateY(180deg) rotateX(30deg);
  }
  100% {
    -webkit-transform: rotateY(360deg) rotateX(30deg);
  }
}
@keyframes ini-scaleout {
  0% {
    transform: scale(0.25);
  }
  100% {
    transform: scale(1);
    opacity: 0.25;
  }
}
</style>
