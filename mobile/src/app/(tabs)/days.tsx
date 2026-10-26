import { Card, EmptyState, Screen } from '@/components/ui';

export default function DaysScreen() {
  return (
    <Screen eyebrow="Your journal" title="Days">
      <Card>
        <EmptyState
          icon={{ ios: 'book', android: 'auto_stories', web: 'auto_stories' }}
          title="No entries yet"
          description="Finalized days show up here, newest first."
        />
      </Card>
    </Screen>
  );
}
