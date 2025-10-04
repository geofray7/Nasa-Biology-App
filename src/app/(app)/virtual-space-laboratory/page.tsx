import VirtualSpaceLab from './lab';

export default function VirtualSpaceLaboratoryPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">
          Virtual Space Laboratory
        </h1>
        <p className="text-muted-foreground">
          Simulate NASA biology experiments in space conditions.
        </p>
      </div>
      <VirtualSpaceLab />
    </div>
  );
}
