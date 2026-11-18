# Austine Agunda Portfolio

A standalone React and JavaScript portfolio with a lightweight introduction,
separate Story, Projects, and Contact views, and a scroll-responsive 3D particle
story inspired by the original canvas and Three.js studies. The Story follows
data from a cautionary quote through statistics, analysis, design, and
decision-making; project cards appear only in the Projects view. Intro and
Contact are designed to fit a single viewport. Use Intro to return to the
landing page, Download CV in the navigation to get the résumé, and the theme
toggle to switch light or dark mode across the site.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

The Three.js scene is loaded after opening the portfolio and is omitted from
Projects. The contact form opens an email draft in the visitor's default mail
app. Public project images and the CV are kept in `public/`.
