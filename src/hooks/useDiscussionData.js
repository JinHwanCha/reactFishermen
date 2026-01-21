import { useState, useEffect } from 'react';

export function useDiscussionData() {
  const [data, setData] = useState({
    title: '',
    passage: '',
    preacher: '',
    observationQuestions: [],
    applicationQuestions: [],
    sharingTitle: '',
    sharingQuestions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sheetURL =
      'https://docs.google.com/spreadsheets/d/103zpvnwBbgXOTt5hrWQxG5Duxw34hRphmHu3pMwtCZc/gviz/tq?tqx=out:json';

    fetch(sheetURL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        const dataMap = {};

        rows.forEach((row) => {
          if (!row.c || row.c.length < 2) return;

          const key = row.c[0]?.v?.trim();
          const value = row.c[1]?.v?.trim();

          if (
            !key ||
            !value ||
            key === '분류' ||
            key === '나눔지 상단 제목'
          ) {
            return;
          }

          if (!dataMap[key]) {
            dataMap[key] = [];
          }

          dataMap[key].push(value);
        });

        const usedKeys = [
          '주일예배 제목',
          '주일예배 말씀',
          '설교자',
          '본문 질문',
          '적용 질문',
        ];

        const sharingKey = Object.keys(dataMap).find(
          (key) => !usedKeys.includes(key)
        );

        setData({
          title: dataMap['주일예배 제목']?.[0] || '',
          passage: dataMap['주일예배 말씀']?.[0] || '',
          preacher: dataMap['설교자']?.[0] || '',
          observationQuestions: dataMap['본문 질문'] || [],
          applicationQuestions: dataMap['적용 질문'] || [],
          sharingTitle: sharingKey || '',
          sharingQuestions: sharingKey ? dataMap[sharingKey] || [] : []
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Google Sheet Load Error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
