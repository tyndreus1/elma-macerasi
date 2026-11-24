# Elma Macerası

Canlı oyun: https://tyndreus1.github.io/elma-macerasi/

Murat ve oğlu Ege (12) için piksel-art, yan kaydırmalı kooperatif arcade. Süper Mario tarzı zıplama / hendek / platform ile Final Fight tarzı yürüyen sevimli düşmanlar ve seviye sonu patronları karışımı. Düşmanlar şirin: huysuz mantarlar, yaramaz kirpiler, kaygan salyangozlar ve zıpzıp jöleler. Kan yok.

Elmalar hem puan hem cephane. Elma atarak düşmanları alt edin; elma bitince küçük bir tekme / itme kalır.

## Nasıl oynanır

Tarayıcıda açın (klavye veya telefon, yatay).

### Oyuncu 1 — Murat (baba)

| Tuş | İş |
| --- | --- |
| A / D | Sol / sağ |
| W veya Boşluk | Zıpla |
| F (veya Sol Shift / G) | Elma at / tekme |

### Oyuncu 2 — Ege

| Tuş | İş |
| --- | --- |
| ← / → | Sol / sağ |
| ↑ | Zıpla |
| K (veya L / .) | Elma at / tekme |

Tek oyuncu: başlıkta **1 Oyuncu** sonra **Hazır!**. İki kişi aynı klavyede: **2 Oyuncu**.

### Telefon (yatay)

- Sol: yön ◀ ▶
- Sağ: **Zıpla** ve **Elma**
- 2 oyuncu tek telefonda: sol küme P1, sağ küme P2
- Dikeyde **Telefonu yan çevirin** uyarısı çıkar
- **Hazır!** ilk dokunuşta mümkünse tam ekran + yatay kilit dener
- Kaydırma / pinch-zoom kapalıdır

## Seviyeler

1. **Orman** — çukurlar, elma ağaçları, mantar ve kirpi. Patron: **Kral Mantar**
2. **Kale** — tuğla, dikenler, salyangoz ve jöle. Patron: **Şövalye Kirpi**
3. **Bulutlar** — kopuk bulut platformları. Patron: **Bulut Kralı**

Hendeke düşmek bir can götürür. Canlar (kalpler) ve elma sayacı oyuncu başına HUD’da.

## Yerelde çalıştırma

Node 20+ gerekir.

```bash
npm install
npm run dev
```

Oyun `http://localhost:43180` adresinde açılır.

Üretim derlemesi (statik klasör: `dist/`):

```bash
npm run build
npm run preview
```

`vite.config.ts` içinde `base: './'` var; GitHub Pages proje sitesi ve Netlify göreli yollarla çalışır.

## Yayınlama

**Netlify:** `netlify.toml` derlemeyi `npm run build`, yayını `dist` olarak ayarlar. Repoyu Netlify’ye bağlayın.

**GitHub Pages:** Canlı oyun https://tyndreus1.github.io/elma-macerasi/

`.github/workflows/deploy-pages.yml` kaynak repoda `main` push’larında derler. Proje Pages’ini ilk kez açmak için **Settings → Pages → Source: GitHub Actions** gerekir; `GITHUB_TOKEN` siteyi kendisi oluşturamaz. Bu yüzden derlenmiş oyun kullanıcı sitesinde (`tyndreus1.github.io/elma-macerasi/`) yayınlanır.

## Teknik

Phaser 3 + Vite + TypeScript. Piksel kahramanlar kodla çizilir (orijinal sprite’lar). Sesler Web Audio ile chiptune. Harici API / sunucu yok.
