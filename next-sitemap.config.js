/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://backlineit.hu',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: ['/dashboard/', '/checkout/', '/api/', '/admin/'] },
        ],
    },
    exclude: ['/dashboard*', '/checkout*', '/api*', '/admin*', '/auth*'],
}
