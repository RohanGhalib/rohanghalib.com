export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Assuming admin routes shouldn't be indexed
        },
        sitemap: 'https://rohanghalib.com/sitemap.xml',
    }
}
