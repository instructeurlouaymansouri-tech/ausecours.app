'use client';

import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-muted">
      AUSECOURS · {t('footer_tag')} · <b className="font-semibold text-white">Powered By Mansouri Louay</b>
    </footer>
  );
}
