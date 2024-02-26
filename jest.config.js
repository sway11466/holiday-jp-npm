module.exports = {
    // Jestがテストファイルを検索するためのルートディレクトリ
    roots: ['<rootDir>/test'],

    // テストに使用するテスト環境
    testEnvironment: 'node',

    // Jestがテストファイルとして認識するファイル拡張子
    testRegex: '\\.(js|jsx|ts|tsx)$',

    // テスト内でモジュールの依存関係を解決するためのモジュール名マッパー
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // テスト実行前にコードをトランスパイルするためのトランスフォーム設定
    preset: "ts-jest",
    transformIgnorePatterns: ["/node_modules/(?!three/examples/)"],
    transform: {
      "node_modules/three/examples/.+.(j|t)sx?$": "ts-jest",
    },
    testEnvironment: "node",
};
