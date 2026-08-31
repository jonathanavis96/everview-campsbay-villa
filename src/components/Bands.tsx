// The one full-bleed photograph on the page.
//
// There used to be two. The second was a sunset over the Atlantic, and it was
// the lowest-resolution plate on the site; the 2026-08 shoot is entirely
// midday, so there was nothing to upgrade it with and it was cut rather than
// left as the one soft frame among sharp ones (2026-08-31).
//
// This one is here because the page needs to show the view early, as the
// thing being sold, and it belongs to no room — so it belongs in no
// folder-addressed level section either.
import PhotoBand from "@/components/PhotoBand";
import beach from "@/assets/everview_photos_webp/views/4-view-camps-bay-beach.webp";
import beachLead from "@/assets/everview_photos_webp_lead/views/4-view-camps-bay-beach.webp";
import beachMid from "@/assets/everview_photos_webp_mid/views/4-view-camps-bay-beach.webp";

/** The daytime bay, straight after the opening statement. */
export function BeachBand() {
  return (
    <PhotoBand
      src={beach}
      leadSrc={beachLead}
      midSrc={beachMid}
      width={1600}
      height={1067}
      position="center 62%"
      alt="Camps Bay beach and the open Atlantic, seen from the property above the bay"
      caption="Camps Bay beach and the Atlantic, from the house."
    />
  );
}
