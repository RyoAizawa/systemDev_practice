Vue.createApp({
  data: function () {
    return {
      sortKey: "",
      sortOrder: 0,
      cards: [],
    };
  },
  created: async function () {
    // コンポーネント作成時にjsonファイルからオブジェクトを取得
    const res = await fetch("./cards.json");
    const cards = await res.json();
    this.cards = cards;
  },
  methods: {
    sortBy(key) {
      // 前回昇順なら降順、全開降順なら昇順にする。
      this.sortOrder === 0 ? (this.sortOrder = 1) : (this.sortOrder = 0);
      // 前回と違うキーを選択した場合、昇順からスタート
      if (this.sortKey !== key) {
        this.sortOrder = 0;
      }
      // 昇順へソート
      if (this.sortOrder === 0) {
        // idの場合には数字での比較なので文字列とは別な処理を行う。
        if (key === "id") {
          this.cards.sort((a, b) => {
            return a[key] - b[key];
          });
        } else {
          this.cards.sort((a, b) => {
            return a[key].localeCompare(b[key]);
          });
        }
      // 降順へソート
      } else {
        // idの場合には数字での比較なので文字列とは別な処理を行う。
        if (key === "id") {
          this.cards.sort((a, b) => {
            return b[key] - a[key];
          });
        } else {
          this.cards.sort((a, b) => {
            return b[key].localeCompare(a[key]);
          });
        }
      }
      // 今回ソートを行ったキーを保持
      this.sortKey = key;
    },
    addClass(key) {
      return {
        // 今回ソートを行い、昇順の場合クラス名「asc」を返す
        asc: this.sortKey === key && this.sortOrder === 0,
        // 今回ソートを行い、降順の場合クラス名「desc」を返す
        desc: this.sortKey === key && this.sortOrder === 1,
      };
    },
  },
}).mount("#app");
