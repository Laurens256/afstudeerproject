# Installation

1. Clone the repo

```bash
git clone https://github.com/Laurens256/afstudeerproject.git
```

2. Install NPM packages

```bash
npm install
```

3. Add the necessary environment variables:

##### `apps/client/.env.development`

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

##### `apps/server/.env.development`

```
CLIENT_URL=http://localhost:3000
```

3. Start the application

```bash
npm run dev
```

4. Open the application in your browser http://localhost:3000 (or the port you specified in the environment variables)

## Requirements

- Node.js >=v20.10.0

## Sources

Sources listed are also mentioned in the code where they are used.

- Chat message sfx by floraphonic: https://pixabay.com/sound-effects/happy-pop-2-185287/
- Join / leave room sfx by SoundsForYou: https://pixabay.com/sound-effects/notifications-sound-127856/
- Game button design: https://dribbble.com/shots/3456012-game-button
- Game button design code: https://codepen.io/Rybak/pen/xdzXNj
- CSS loader animation: https://cssloaders.github.io/
- CSS ribbon: https://css-generators.com/ribbon-shapes/
- useLocalStorage hook: https://github.com/mantinedev/mantine/tree/master/packages/%40mantine/hooks/src/use-local-storage
- usePreviousState hook: https://stackoverflow.com/a/57706747/16071690
