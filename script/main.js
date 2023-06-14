Vue.createApp({
  data: function () {
    return {
      sortKey: "",
      sortOrder: 0,
      orgCards: [], // 初期値の社員情報
      filteredCards: [], // ソート、検索結果を入れる社員情報
      searchSelect: "default",
      searchText: "",
      error: false,
    };
  },
  created: async function () {
    // コンポーネント作成時にjsonファイルからオブジェクトを取得
    const res = await fetch("./cards.json");
    const cards = await res.json();
    // 初期値の社員情報はコンポーネント内に保持
    this.orgCards = JSON.parse(JSON.stringify(cards));
    // フィルター済みの社員情報を出力する
    this.filteredCards = JSON.parse(JSON.stringify(cards));
  },
  methods: {
    sortBy(key, callSearch = false) {
      // 前回昇順なら降順、前回降順なら昇順にする。検索からの呼び出しならそのまま。
      if (!callSearch) {
        this.sortOrder === 0 ? (this.sortOrder = 1) : (this.sortOrder = 0);
      }
      // 前回と違うキーを選択した場合、または検索の場合は昇順からスタート
      if (this.sortKey !== key) {
        this.sortOrder = 0;
      }
      // 昇順へソート
      if (this.sortOrder === 0) {
        // idの場合には数字での比較なので文字列とは別な処理を行う。
        if (key === "id") {
          this.filteredCards.sort((a, b) => {
            return a[key] - b[key];
          });
        } else {
          this.filteredCards.sort((a, b) => {
            return a[key].localeCompare(b[key]);
          });
        }
        // 降順へソート
      } else {
        // idの場合には数字での比較なので文字列とは別な処理を行う。
        if (key === "id") {
          this.filteredCards.sort((a, b) => {
            return b[key] - a[key];
          });
        } else {
          this.filteredCards.sort((a, b) => {
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
    search() {
      // 標準を選択し検索した場合の処理
      if (this.searchSelect === "default") {
        // フィルター済みの社員情報を初期化
        this.filteredCards = [];
        // オリジナルの社員情報をコピー
        this.filteredCards = JSON.parse(JSON.stringify(this.orgCards));
        // 入力されている検索語句は削除
        this.searchText = "";
        // ソートのデータにはnullを代入してaddClassで追加されている矢印を消す
        this.sortOrder = null;
        return;
      }

      // 検索語句が何も入力されていない場合エラーを出力し関数終了
      if (this.searchText === "") {
        this.error = true;
        return;
      } else {
        this.error = false;
      }
      // フィルター済みの社員情報を初期化
      this.filteredCards = [];
      // オリジナルの社員情報分処理を繰り返す
      for (index in this.orgCards) {
        // 選択された検索項目の値を変数に保持
        let str = this.orgCards[index][this.searchSelect];
        if (this.searchSelect === "id") {
          // idの場合はナンバー型で全一致比較
          if (str === Number(this.searchText)) {
            this.filteredCards.push(this.orgCards[index]);
          }
        } else {
          // そのほかは文字列の部分一致比較
          if (str.includes(this.searchText)) {
            this.filteredCards.push(this.orgCards[index]);
          }
        }
      }
      // 初回はデフォルトの順番で出力
      // ソートを選択済みの場合は前回のキーのままソートをかける
      if (!this.sortKey == "") {
        this.sortBy(this.sortKey, true);
        this.addClass(this.sortKey);
      }
    },
  },
}).mount("#app");
