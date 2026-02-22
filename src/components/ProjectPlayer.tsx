import { useState, useEffect, useCallback } from 'react';

interface Version {
  version: number;
  title: string;
  summary?: string;
  createdAt: string;
  highlights: string[];
  html: string;
}

interface Props {
  versions: Version[];
  initialVersion?: number;
  lang: 'ko' | 'en';
}

const ui = {
  ko: {
    version: '버전',
    of: '/',
    prev: '이전',
    next: '다음',
    highlights: '주요 변경점',
    noHighlights: '변경점 요약 없음',
  },
  en: {
    version: 'Version',
    of: '/',
    prev: 'Prev',
    next: 'Next',
    highlights: 'Highlights',
    noHighlights: 'No highlights',
  },
};

export default function ProjectPlayer({ versions, initialVersion = 1, lang }: Props) {
  const [currentVersion, setCurrentVersion] = useState(initialVersion);
  const t = ui[lang];

  const currentData = versions.find((v) => v.version === currentVersion);
  const maxVersion = Math.max(...versions.map((v) => v.version));
  const minVersion = Math.min(...versions.map((v) => v.version));

  const goToPrev = useCallback(() => {
    if (currentVersion > minVersion) {
      setCurrentVersion(currentVersion - 1);
    }
  }, [currentVersion, minVersion]);

  const goToNext = useCallback(() => {
    if (currentVersion < maxVersion) {
      setCurrentVersion(currentVersion + 1);
    }
  }, [currentVersion, maxVersion]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // URL 업데이트 (history 조작 없이 표시용)
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', String(currentVersion));
    window.history.replaceState({}, '', url.toString());
  }, [currentVersion]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 타임라인 사이드바 */}
      <aside className="lg:w-56 shrink-0">
        <div className="sticky top-20 space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Timeline
          </h3>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
            {versions.map((v) => (
              <button
                key={v.version}
                onClick={() => setCurrentVersion(v.version)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentVersion === v.version
                    ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      currentVersion === v.version
                        ? 'bg-brand-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  <span className="truncate">
                    v{v.version} - {v.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 min-w-0">
        {/* 버전 헤더 */}
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-full text-sm font-medium">
              {t.version} {currentVersion}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {currentData?.createdAt}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {currentData?.title}
          </h2>
          {currentData?.summary && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentData.summary}
            </p>
          )}
        </div>

        {/* 하이라이트 */}
        {currentData?.highlights && currentData.highlights.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
              {t.highlights}
            </h3>
            <ul className="space-y-1">
              {currentData.highlights.map((h, i) => (
                <li
                  key={i}
                  className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-1">•</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 본문 */}
        <article
          className="prose dark:prose-invert prose-gray max-w-none
            prose-headings:font-bold
            prose-a:text-brand-600 dark:prose-a:text-brand-400
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800"
          dangerouslySetInnerHTML={{ __html: currentData?.html || '' }}
        />

        {/* 네비게이션 컨트롤 */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goToPrev}
              disabled={currentVersion <= minVersion}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.prev}
            </button>

            {/* 슬라이더 */}
            <div className="flex-1 max-w-md flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">
                v{minVersion}
              </span>
              <input
                type="range"
                min={minVersion}
                max={maxVersion}
                value={currentVersion}
                onChange={(e) => setCurrentVersion(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
                v{maxVersion}
              </span>
            </div>

            <button
              onClick={goToNext}
              disabled={currentVersion >= maxVersion}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t.next}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 현재 위치 표시 */}
          <div className="text-center mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t.version} {currentVersion} {t.of} {maxVersion}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
