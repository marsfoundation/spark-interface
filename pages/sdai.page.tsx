import { MainLayout } from 'src/layouts/MainLayout';

export default function SDAI() {
  return (
    <>
      <h1>sDAI</h1>
    </>
  );
}

SDAI.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
