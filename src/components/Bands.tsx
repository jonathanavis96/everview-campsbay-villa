// The two full-bleed photographs on the page, and the only two.
//
// Both are the owners' own frames from the property, recovered from the
// pre-renovation archive (2017). They are here because the page needs to show
// the view twice — once early, as the thing being sold, and once late, as the
// reason a guest stays in rather than going out — and neither belongs to a
// room, so neither belongs in the folder-addressed level sections.
import PhotoBand from "@/components/PhotoBand";
import beach from "@/assets/everview_photos_webp/views/4-view-camps-bay-beach.webp";
import beachLead from "@/assets/everview_photos_webp_lead/views/4-view-camps-bay-beach.webp";
import beachMid from "@/assets/everview_photos_webp_mid/views/4-view-camps-bay-beach.webp";
import sunset from "@/assets/everview_photos_webp/views/3-view-sunset.webp";
import sunsetLead from "@/assets/everview_photos_webp_lead/views/3-view-sunset.webp";
import sunsetMid from "@/assets/everview_photos_webp_mid/views/3-view-sunset.webp";

/** The daytime bay, straight after the opening statement. */
export function BeachBand() {
  return (
    <PhotoBand
      src={beach}
      leadSrc={beachLead}
      midSrc={beachMid}
      width={1280}
      height={960}
      position="center 62%"
      alt="Camps Bay beach and the open Atlantic, seen from the property above the bay"
      caption="Camps Bay beach and the Atlantic, from the house."
    />
  );
}

/** The evening, after the reviews and before the rate. */
export function SunsetBand() {
  return (
    <PhotoBand
      src={sunset}
      leadSrc={sunsetLead}
      midSrc={sunsetMid}
      width={1600}
      height={1200}
      position="center 45%"
      alt="Sunset over the Atlantic with the lights of Camps Bay below, seen from the house"
      caption="Sunset over the Atlantic, from the terrace."
    />
  );
}
