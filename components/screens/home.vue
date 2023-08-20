<script setup lang="ts">
import dayjs from 'dayjs'
import type { ContentKind, ServiceType } from '@/types/content'

const services = computed<ServiceType[]>((): ServiceType[] => [
  {
    id: 1,
    customerId: 1,
    title: 'ホームページ作成',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      settings: {
        lgSize: 'cover',
        smSize: 'cover',
        lgPosition: 'center',
        smPosition: 'center',
        lgParallax: 'scroll',
        smParallax: 'scroll',
      },
    },
    body: `PC からスマホまでレスポンシブなデザインのホームページを作成いたします。
    またお客様とのやりとりをインタラクティブに行える Web サイトの開発についてもぜひご相談ください。。
    `,
    position: 1,
  },
  {
    id: 2,
    customerId: 1,
    title: 'ソフトウェア開発',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      settings: {
        lgSize: 'cover',
        smSize: 'cover',
        lgPosition: 'center',
        smPosition: 'center',
        lgParallax: 'scroll',
        smParallax: 'scroll',
      },
    },
    body: `お客様のWebアプリケーションなど各種ソフトウェア開発を行います。
    上流工程から下流工程まで、また、PM や PMO 業務などの開発管理につきましてもお気軽にご相談ください。
    `,
    position: 2,
  },
  {
    id: 3,
    customerId: 1,
    title: 'AWSクラウド導入',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      settings: {
        lgSize: 'cover',
        smSize: 'cover',
        lgPosition: 'center',
        smPosition: 'center',
        lgParallax: 'scroll',
        smParallax: 'scroll',
      },
    },
    body: ` 代表ナガズミはアマゾンウェブサービスジャパン (AWS) のエンジニアとしての経歴がございます。
    そのキャリアによる技術知見を元に適切なサポートをご提供いたします。
    `,
    position: 3,
  },
])

type DefinePageSections = {
  type: string
  kind: ContentKind
  order: number
  header?: string
}
const pageSections: DefinePageSections[] = [
  {
    type: 'type1',
    kind: 'infomation',
    order: 1,
    header: 'Message',
  },
  {
    type: 'type1',
    kind: 'news',
    order: 2,
    header: "What's New",
  },
  {
    type: 'type1',
    kind: 'services',
    order: 3,
    header: 'Services',
  },
  {
    type: 'type1',
    kind: 'contact',
    order: 4,
    header: 'Contact',
  },
]
</script>

<template>
  <article>
    <div id="index-position-top">
      <SectionsType1Eyecatcher />
    </div>

    <section
      v-for="section in pageSections"
      :id="`index-position-${section.kind}`"
      class="section-margin"
    >
      <template v-if="section.type === 'type1'">
        <SectionsType1SectionHeader
          v-if="section.header?.length"
          :header-string="section.header"
        />
        <SectionsType1Information v-if="section.kind === 'infomation'" />
        <SectionsType1NewsList v-if="section.kind === 'news'" />
        <SectionsType1Services
          v-if="section.kind === 'services'"
          :services="services"
        />
        <SectionsType1Contact v-if="section.kind === 'contact'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.section-title {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  span {
    background: linear-gradient(transparent 75%, orange 75%);
    font-weight: bold;
  }
}

.section-margin {
  padding-top: calc($nav-header-height + 3rem);
  margin-bottom: 4rem;
}
</style>
