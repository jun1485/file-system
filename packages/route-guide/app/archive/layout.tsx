export default function ArchiveLayout({
  archive,
  latestNews,
}: {
  archive: React.ReactNode;
  latestNews: React.ReactNode;
}) {
  return (
    <>
      <section id="archive-filter">{archive}</section>
      <section id="archive-latest">{latestNews}</section>
    </>
  );
}
