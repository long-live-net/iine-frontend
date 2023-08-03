<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  ContentKind,
  EyecatchType,
  InformationType,
  NewsType,
  ServiceType,
  ContactType,
} from '@/types/content'

const information = computed<InformationType>(() => ({
  id: 1,
  customerId: 1,
  title: 'テストタイトル',
  subtitle: 'サブタイトル',
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
  body: `
    多くの方よりこのような悩みをご相談をいただいております。
        このような悩みを解決するには、その悩みに寄り添い適切な技術をご提供できることが第一です。
        一方で、お悩みをお持ちの方ご自身や組織自体にも情報技術を正しく知っていただき、自らしっかりと活用できるチカラをある程度養っていただくことも重要です。
        最終的には、これらの技術を自ら楽しんでご活用いただくようになる事が、長期継続的な悩みの解決に繋がるものと考えます。
        皆様のシステム開発やクラウド導入を行いつつ、お客様ご自身や組織のチカラを向上するお手伝いができれば幸いです。どうぞよろしくお願いします。
        ロングリブネット 長住 直樹（ナガズミ ナオキ）
    `,
}))

const newses = computed<NewsType[]>((): NewsType[] => [
  {
    id: 1,
    customerId: 1,
    title: 'ロングリブネットを開業いたしました。',
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
    body: `おかげさまを持ちまして、2020年2月10日にロングリブネットを開業いたしました。
    当面は次の業務を中心としてご要望を承ります。
    AWS クラウドを使用したインフラ構築 AWS 技術支援 各種 Web システム開発 技術顧問業 ホームページ作成。
    `,
    category: 'I',
    publishOn: dayjs().toDate(),
  },
  {
    id: 2,
    customerId: 1,
    title: '当事業所のホームページを作成いたしました',
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
    body: `
    ご覧いただいておりますとおり、ロングリブネットのホームページを作成いたしました。
    こちらのサイトは django という Python で作成されたサーバサイドの Web フレームワークをベースとして作成いたしました。
    まだまだ取り敢えずという形で最低限の建てつけとなっておりますが、今後徐々にコンテンツを増やすとともに、必要に応じて Javascript によるアプリケーションも追加していきたいと考えております。
    今後ともよろしくお願いいたします。
    `,
    category: 'I',
    publishOn: dayjs().toDate(),
  },
  {
    id: 3,
    customerId: 1,
    title: '初仕事で開発したサイトがリリースされました',
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
    body: `
    初めて頂いた仕事で開発していた Web サイト がリリースされました。
    詳しいことは公表できないのですが、人材募集とかキューレーション関連のWebサービスとなります。
    `,
    category: 'W',
    publishOn: dayjs().toDate(),
  },
])

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

const contact = computed<ContactType>(() => ({
  id: 1,
  customerId: 1,
  title: 'テストタイトル',
  subtitle: 'サブタイトル',
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
  body: `
    〒210-0007
    神奈川県川崎市川崎区駅前本町11番地2 川崎フロンティアビル4階
    ロングリブネット 長住直樹
    TEL: 050-5241-3096
    https://www.longlivenet.com/
    `,
}))

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
        <SectionsType1Information
          v-if="section.kind === 'infomation'"
          :information-data="information"
        />
        <SectionsType1Newses v-if="section.kind === 'news'" :newses="newses" />
        <SectionsType1Services
          v-if="section.kind === 'services'"
          :services="services"
        />
        <SectionsType1Contact
          v-if="section.kind === 'contact'"
          :contact-data="contact"
        />
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
