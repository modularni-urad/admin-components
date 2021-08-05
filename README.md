# [Modularni urad](https://modularni-urad.github.io/) admin webclient

## how to debug

``` bash
# Install dependencies.
npm install

# Serve with automatic reloading.
npm start
```

#### Update zavislosti

```
git submodule update --remote --merge
```

#### init zavislosti

```
git submodule add https://github.com/pirati-web/layouts _layouts
git submodule add https://github.com/pirati-web/partials _includes/shared/
git submodule init
```