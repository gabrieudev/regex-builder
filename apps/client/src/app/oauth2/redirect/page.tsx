import { Suspense } from "react";
import OAuthRedirectClient from "./client";

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <OAuthRedirectClient />
    </Suspense>
  );
}
