import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import fs from 'fs';

/**
 * `assets/` 디렉토리(이미지, 폰트 등)를 빌드 결과 `dist/assets/` 로 복사.
 * Vite lib 모드는 정적 import 된 자산만 처리하므로,
 * URL 로 직접 참조되는 자산(예: `/api/templates/assets/ryan-offset/assets/...`)을
 * 빌드 산출물에 포함시키기 위해 closeBundle 시점에 재귀 복사한다.
 */
function copyStaticAssets(): Plugin {
  return {
    name: 'copy-static-assets',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'assets');
      const dest = path.resolve(__dirname, 'dist/assets');
      if (!fs.existsSync(src)) return;
      const copyRecursive = (s: string, d: string) => {
        fs.mkdirSync(d, { recursive: true });
        for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
          const sp = path.join(s, entry.name);
          const dp = path.join(d, entry.name);
          if (entry.isDirectory()) copyRecursive(sp, dp);
          else fs.copyFileSync(sp, dp);
        }
      };
      copyRecursive(src, dest);
    },
  };
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'node_modules'],
    }),
    copyStaticAssets(),
  ],

  build: {
    // 라이브러리 모드 설정
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RyanOffset', // 전역 변수명 (IIFE 모드용)
      fileName: 'components',
      formats: ['iife'], // IIFE 포맷만 빌드
    },

    // 빌드 출력 설정
    outDir: 'dist',
    emptyOutDir: true,

    // 소스맵 생성
    sourcemap: true,

    // 외부 종속성 (번들에 포함하지 않음)
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],

      output: {
        // 전역 변수 매핑
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },

        // 에셋 파일명 패턴
        assetFileNames: (assetInfo) => {
          // CSS 파일
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          // 폰트 파일
          if (assetInfo.name?.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name][extname]';
          }
          // 이미지 파일
          if (assetInfo.name?.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            return 'assets/images/[name][extname]';
          }
          return 'assets/[name][extname]';
        },

        // JS 파일명 패턴
        entryFileNames: 'js/components.iife.js',
        chunkFileNames: 'js/[name]-[hash].js',
      },
    },

    // 빌드 최적화
    minify: 'esbuild',
    target: 'es2020',

    // Chunk 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
  },

  // 타입스크립트 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },

  // 테스트 설정
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // React 19 + @testing-library/react 호환성
    deps: {
      inline: ['react-dom'],
    },
  },
});
