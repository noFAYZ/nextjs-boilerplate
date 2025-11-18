'use client';

/**
 * Organization Layout
 *
 * Layout for organization-specific pages
 */

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return <div>{children}</div>;
}
