import LuisterFilter from '../../components/sections/LuisterFilter';

export default function LuisterPage() {
  return (
    <main>
      {/* 1. Banner Sectie (Precies zoals in je NJK) */}
      <section className="column stack spacing-xl pattern WoB" id="banner_luister">
        <div className="column overlay constrainer spacing-l header">
          <div className="column banner-wrapper spacing-xxl">
            <div className="column text-wrapper spacing-xs center">
              <h1>Luister</h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter & Content Sectie (De 'schil' die je miste) */}
      <section className="column wrapper spacing-xl center WoB">
        <div className="column constrainer">
           {/* De LuisterFilter component bevat nu alleen de binnenkant (de zwarte box en filters) */}
           <LuisterFilter />
        </div>
      </section>
    </main>
  );
}