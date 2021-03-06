import { contentFunc } from '@nuxt/content/types/content'
import { IContent } from '~/types/content/page'

export default async ($content: contentFunc, currentPage: number, perPage: number, error: any, path: string) => {
  const allArticles = await $content(path, { deep: true })
    .only(['title', 'description', 'image', 'slug', 'tags', 'published', 'contentBeforeJson'])
    .sortBy('published', 'desc')
    .fetch<IContent[]>()
  const totalArticles = allArticles.length

  /**
   * Số trang
   * Tổng items / items trên 1 page
   */
  const lastPage = Math.ceil(totalArticles / perPage)
  const lastPageCount = totalArticles % perPage

  /**
   * Tính số items cần bỏ qua khi get
   */
  const skipNumber = () => {
    if (currentPage === 1) {
      return 0
    }
    if (currentPage === lastPage) {
      return totalArticles - lastPageCount
    }
    return (currentPage - 1) * perPage
  }

  /**
   * get items skip
   */
  const paginatedArticles = await $content(path, { deep: true })
    .only(['title', 'description', 'image', 'slug', 'tags', 'published', 'contentBeforeJson'])
    .sortBy('published', 'desc')
    .limit(perPage)
    .skip(skipNumber())
    .fetch<IContent[]>()

  if (currentPage === 0 || !paginatedArticles.length) {
    return error({ statusCode: 404, message: 'No articles found!' })
  }

  return {
    allArticles,
    paginatedArticles
  }
}
