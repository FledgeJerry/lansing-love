export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">About lansing.love</h1>
        <p className="text-gray-500">A civic prediction project for the Lansing community.</p>
      </div>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Why this exists</h2>
        <p className="text-gray-700 leading-relaxed">
          Lansing has a lot going on — city council votes, zoning decisions, budget battles, local
          elections — and most of it happens without most residents ever knowing. This site exists to
          change that. By turning civic events into predictions, we make local government more
          approachable, more engaging, and more fun to follow.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our goal is simple: get more Lansing residents paying attention to what their city is
          doing, and reward the ones who do.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
            <p className="font-semibold text-rose-700 mb-1">City Council</p>
            <p className="text-sm text-gray-600">
              Follow what&apos;s actually on the agenda and predict how votes will land.
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
            <p className="font-semibold text-rose-700 mb-1">Rhino News</p>
            <p className="text-sm text-gray-600">
              Questions are sourced and resolved by the{" "}
              <a
                href="https://rhinonews.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-rose-700"
              >
                Rhino journalism co-op
              </a>
              , Lansing&apos;s independent local newsroom.
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
            <p className="font-semibold text-rose-700 mb-1">Local Rewards</p>
            <p className="text-sm text-gray-600">
              Top predictors will be recognized and rewarded by locally owned Lansing businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Hosted on a Pi */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Runs on a Raspberry Pi</h2>
        <p className="text-gray-700 leading-relaxed">
          This entire site is hosted on a single Raspberry Pi sitting inside{" "}
          <a
            href="https://thefledge.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 hover:underline"
          >
            The Fledge
          </a>
          , Lansing&apos;s working-class makerspace and incubator on Michigan Ave. No cloud
          provider. No data center. No server farm humming somewhere in Virginia consuming megawatts
          of power.
        </p>
        <p className="text-gray-700 leading-relaxed">
          A Raspberry Pi uses about 5 watts of power — roughly the same as an LED nightlight. We
          think that&apos;s a pretty good match for a site about a city the size of Lansing. Local
          infrastructure for local civic life.
        </p>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
          <span className="text-2xl">🍓</span>
          <span>Hosted on a Raspberry Pi at The Fledge, 1300 Eureka St, Lansing, MI 48912</span>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Disclaimer</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>
            <strong>This is not a betting site.</strong> No real money is wagered, won, or lost on
            this platform. lansing.love is a free, entertainment and education service only.
          </p>
          <p>
            Predictions made on this site carry no monetary value and create no legal or financial
            obligation of any kind. Leaderboard standings and any associated rewards are offered
            purely as community recognition by participating local businesses at their own
            discretion.
          </p>
          <p>
            All content on this site is for informational and civic engagement purposes only.
            Question outcomes are determined by the Rhino journalism co-op based on publicly
            available information. We make no guarantee of accuracy or timeliness of resolution.
          </p>
        </div>
      </section>

      {/* Built by */}
      <section className="text-sm text-gray-400 border-t border-gray-100 pt-6">
        Built with care in Lansing, Michigan.{" "}
        <a
          href="https://thefledge.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600"
        >
          The Fledge
        </a>{" "}
        · {" "}
        <a
          href="https://rhinonews.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600"
        >
          Rhino News
        </a>
      </section>
    </div>
  );
}
