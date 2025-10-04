import { Galaxy } from './galaxy';

export const metadata = {
  title: 'Cosmic Research Galaxy',
};

export default function CosmicResearchGalaxyPage() {
  return (
    <div className="h-full w-full -m-4 sm:-m-6 lg:-m-8">
      <Galaxy />
    </div>
  );
}
