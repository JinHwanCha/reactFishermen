import { useState, useEffect } from 'react';

export function useFishermenData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1fZ9UU4xTD0h0CpjLigxQpI-nYSdL4bIM3pE3YuI6gH8/gviz/tq?tqx=out:json"
        );
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const rows = json.table.rows;

        const formattedData = rows.slice(1).map((row) => ({
          title: row.c[0]?.v || "",
          link: row.c[1]?.v || "#",
          imageSrc: row.c[2]?.v || "",
          category: row.c[3]?.v || "",
          leaders: row.c[4]?.v || "",
          kakaoID: row.c[5]?.v || "",
          contentImg: row.c[6]?.v || "",
          content: row.c[7]?.v || "",
          linkTitle: row.c[8]?.v || "확인",
          closeLink: row.c[9]?.v || ""
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
