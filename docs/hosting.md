# Hosting and domain decision

Decision snapshot: 15 August 2026. Recheck availability and checkout totals immediately before purchase.

## Hosting

GitHub Pages is the default because this is a static Vite site and the existing portfolio already uses GitHub Pages. No server, database, SSR platform, or paid hosting is needed.

Important boundary: GitHub Pages is available from public repositories on GitHub Free. Hosting Pages from a private repository requires an eligible paid GitHub plan. The repository therefore needs a complete public-safety review before it becomes public.

The minimal deployment path is:

1. Create a public `nimesh-os` repository after the safety check passes.
2. Push the reviewed local history only after approval.
3. Use a GitHub Actions Pages workflow to install dependencies, build the Vite site, and deploy `dist/`.
4. Keep generated resume PDFs in `public/resume/` so Vite copies them into the deployed site.
5. Add a custom domain only after the GitHub Pages URL works.

Do not add a deployment workflow before the remote repository and visibility decision exist. It would be untestable configuration with no owner yet.

## Domain

Preferred domain: `nimeshjohari.com`. It is shorter and easier to say than `nimeshkumarjohari.com`. Official RDAP returned no registration record for both names at the snapshot time; that is not a reservation or purchase guarantee.

Registrar order:

1. Cloudflare Registrar for at-cost registration/renewal, DNSSEC, privacy redaction, and integrated DNS. The domain must use Cloudflare nameservers.
2. Spaceship if the live checkout is materially cheaper and its renewal remains clear. Its published `.com` price at the snapshot was $8.88 registration and $9.98 renewal, plus the ICANN fee.
3. Avoid buying through a teaser-price funnel without comparing the complete term and renewal. The observed GoDaddy cart showed ₹1,029 for one year, ₹1,599 renewal, and an optional ₹599/year protection upsell. The ₹1 headline required a multi-year term.

Buy one `.com`, not a defensive bundle of `.com`, `.in`, `.dev`, and other variants. Add another domain only when actual impersonation or traffic evidence justifies it.

## DNS after purchase

- Make `www.nimeshjohari.com` the canonical host and redirect the apex domain to it.
- Add GitHub's domain-verification TXT record before switching traffic.
- Use a CNAME for `www`; use the registrar's supported apex records for the root.
- Enable registrar lock, two-factor authentication, DNSSEC, and automatic renewal.
- Do not use wildcard DNS records.

References:

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Cloudflare Registrar](https://developers.cloudflare.com/registrar/)
- [Spaceship `.com` pricing](https://www.spaceship.com/domains/gtld/com/)
- [ICANN domain-security guidance](https://www.icann.org/en/blogs/details/do-you-have-a-domain-name-heres-what-you-need-to-know-30-4-2020-en)
