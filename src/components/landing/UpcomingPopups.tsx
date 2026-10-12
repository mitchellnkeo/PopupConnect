import { Link } from "react-router-dom";
import { upcomingPopups } from "../../data/upcomingPopups";
import { btnTertiary } from "../../lib/buttonStyles";
import { landingIcons } from "../../config/landingImages";

export function UpcomingPopups() {
  return (
    <section className="flex flex-col gap-8 bg-teal-600/5 px-4 py-16 md:px-[60px]">
      <div className="flex flex-col gap-2">
        <p className="text-base text-body/60">Checkout events around your area</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-normal text-[40px] text-midnight leading-none">See a space come to life</h2>
          <Link to="/explore" className={btnTertiary}>
            Explore all events
            <img src={landingIcons.arrowRight} alt="" width={18} height={18} />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {upcomingPopups.map((event) => (
          <Link
            key={event.id}
            to={`/vendor/${event.vendorId}`}
            className="flex h-[136px] overflow-hidden rounded-xl bg-white"
          >
            <div className="flex h-full items-center px-5 py-3">
              <div className="flex h-[100px] w-[120px] items-center justify-center rounded-lg bg-teal-600">
                <p className="font-semibold text-2xl text-white">{event.dateLabel}</p>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-5 pl-2">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-bold text-lg text-midnight leading-normal">{event.title}</p>
                  <p className="text-[15px] text-body leading-normal">{event.detail}</p>
                  <p className="text-[15px] text-body leading-normal">{event.place}</p>
                </div>
                <p className="text-body/60 text-xs">Preview listing · Explore details</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
