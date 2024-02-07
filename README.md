# Gogh

![「Super Awesome Curry」の画像を生成する様子](./generate-awesome-curry.gif)

## 動かしてみる

[AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) を動かしてください。

こちらを使うと、`docker`を利用して簡単に立ち上げることができます。

[AbdBarho/stable-diffusion-webui-docker](https://github.com/AbdBarho/stable-diffusion-webui-docker)

```shell
git clone https://github.com/AbdBarho/stable-diffusion-webui-docker
cd stable-diffusion-webui-docker
docker compose --profile download up --build
docker compose --profile [ui] up --build
```

※`[ui]`の部分は、GPUがある方は`auto`,なければ`auto-cpu`を指定してください。

次に`Bun`のインストールをします。
動作確認は行っていないですが、`Node.js,npm`でも動作すると思います。

```
https://bun.sh/docs/installation
```

`web/.env`の値を任意の値に書き換えます。

```shell
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STABLE_DIFFUSION_BASE_URL=http://localhost:7860
```

Next.jsアプリケーションのルートでパッケージのインストール、起動を行います。

```shell
cd gogh/web
bun run dev
```
