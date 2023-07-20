<script setup lang="ts">
import type {
  ContentKind,
  EyecatchType,
  InformationType,
  ContactType,
} from '@/types/content-types'

const eyecatch = computed(
  (): EyecatchType => ({
    id: 1,
    customerId: 1,
    title: 'テストタイトル',
    subtitle: 'サブタイトル',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      lgSize: 'cover',
      smSize: 'cover',
      lgPosition: 'center',
      smPosition: 'center',
      lgParallax: 'scroll',
      smParallax: 'scroll',
    },
  })
)

const information = computed(
  (): InformationType => ({
    id: 1,
    customerId: 1,
    title: 'テストタイトル',
    subtitle: 'サブタイトル',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      lgSize: 'cover',
      smSize: 'cover',
      lgPosition: 'center',
      smPosition: 'center',
      lgParallax: 'scroll',
      smParallax: 'scroll',
    },
    body: `
    多くの方よりこのような悩みをご相談をいただいております。
        このような悩みを解決するには、その悩みに寄り添い適切な技術をご提供できることが第一です。
        一方で、お悩みをお持ちの方ご自身や組織自体にも情報技術を正しく知っていただき、自らしっかりと活用できるチカラをある程度養っていただくことも重要です。
        最終的には、これらの技術を自ら楽しんでご活用いただくようになる事が、長期継続的な悩みの解決に繋がるものと考えます。
        皆様のシステム開発やクラウド導入を行いつつ、お客様ご自身や組織のチカラを向上するお手伝いができれば幸いです。どうぞよろしくお願いします。
        ロングリブネット 長住 直樹（ナガズミ ナオキ）
    `,
  })
)

const contact = computed(
  (): ContactType => ({
    id: 1,
    customerId: 1,
    title: 'テストタイトル',
    subtitle: 'サブタイトル',
    image: {
      url: 'https://iine-bucket.s3.ap-northeast-1.amazonaws.com/uploads/000001/20220526-090500-234.jpg',
      lgSize: 'cover',
      smSize: 'cover',
      lgPosition: 'center',
      smPosition: 'center',
      lgParallax: 'scroll',
      smParallax: 'scroll',
    },
    body: `
    〒210-0007
    神奈川県川崎市川崎区駅前本町11番地2 川崎フロンティアビル4階
    ロングリブネット 長住直樹
    TEL: 050-5241-3096
    https://www.longlivenet.com/
    `,
  })
)

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
  // {
  //   kind: 'news',
  //   order: 2,
  //   component: 'Type1Newses',
  //   title: "What's New",
  // },
  // {
  //   kind: 'services',
  //   order: 3,
  //   component: 'Type1Services',
  //   title: 'Services',
  // },
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
      <Type1Eyecatcher :udata="eyecatch" />
    </div>

    <div
      v-for="section in pageSections"
      :id="`index-position-${section.kind}`"
      class="section-margin"
    >
      <template v-if="section.type === 'type1'">
        <Type1SectionHeader
          v-if="section.header?.length"
          :header-string="section.header"
        />
        <Type1Information
          v-if="section.kind === 'infomation'"
          :udata="information"
        />
        <Type1Contact v-if="section.kind === 'contact'" :udata="contact" />
      </template>
    </div>

    <!-- <article id="index-information-article">
      <section class="article-margin">
        <h4 class="section-title"><span>Message</span></h4>
        <information-detail />
      </section>
    </article>

    <article id="index-news-article">
      <section class="article-margin">
        <h4 class="section-title"><span>What's New</span></h4>
        <newses :limit="5">
          <template #action>
            <b-link to="/news">and more ...</b-link>
          </template>
        </newses>
      </section>
    </article>

    <article id="index-services-article">
      <section class="article-margin">
        <h4 class="section-title"><span>Services</span></h4>
        <services />
      </section>
    </article>

    <article id="index-contact-article">
      <section class="article-margin">
        <h4 class="section-title"><span>Contact</span></h4>
        <contact-detail />
      </section>
    </article> -->
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
