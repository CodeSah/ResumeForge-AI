import { useEffect } from "react";

export default function AdsenseBanner() {

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "inline-block",
        width: "728px",
        height: "90px",
      }}
      data-ad-client="ca-pub-9974800579910171"
      data-ad-slot="8993203665"
    />
  );
}
