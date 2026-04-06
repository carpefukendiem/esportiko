import Link from "next/link";
import { footerCompany, footerServices } from "@/lib/data/nav";
import { EsportikoLogo } from "@/components/layout/EsportikoLogo";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate bg-navy text-off-white">
      <div className="mx-auto max-w-content px-6 py-14 md:px-8 md:py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <EsportikoLogo className="mb-4 h-8 w-auto text-white" />
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-gray-soft">
              Premium custom apparel
            </p>
            <p className="text-body-sm text-gray-soft">
              Serving Goleta, Santa Barbara, and the Central Coast with organized
              team programs and business-ready decoration.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
              Services
            </h2>
            <ul className="space-y-2 text-body-sm">
              {footerServices.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-off-white hover:text-blue-light hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
              Company
            </h2>
            <ul className="space-y-2 text-body-sm">
              {footerCompany.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-off-white hover:text-blue-light hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-sans text-label font-semibold uppercase tracking-wider text-gray-soft">
              Contact
            </h2>
            <p className="mb-2 text-body-sm text-gray-soft">
              Goleta / Santa Barbara area
            </p>
            <p className="mb-2 text-body-sm">
              <a
                href="tel:+18055550123"
                className="hover:text-blue-light hover:underline"
              >
                (805) 555-0123
              </a>
            </p>
            <p className="mb-6 text-body-sm">
              <a
                href="mailto:hello@esportikosb.com"
                className="hover:text-blue-light hover:underline"
              >
                hello@esportikosb.com
              </a>
            </p>
            <p className="mb-6 text-body-sm text-gray-soft">
              Hours: Monday–Friday, 9:00 a.m.–5:00 p.m. PT (by appointment)
            </p>
            <Button asChild variant="primary" className="w-full sm:w-auto">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-slate pt-8 text-body-sm text-gray-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Esportiko. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-off-white hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
