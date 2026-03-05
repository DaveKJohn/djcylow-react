export default function Hero({ title }: { title: string }) {
  return (
    <section className="column stack spacing-xl pattern WoB" id="banner_luister">
      <div className="column overlay constrainer spacing-l header">
        <div className="column banner-wrapper spacing-xxl ">
          <div className="column text-wrapper spacing-xs center">
            <h1>{title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}