import InstagramFollowGate from '@/components/instagram-follow-gate';
import RaffleForm from '@/components/raffle-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <InstagramFollowGate>
        <RaffleForm />
      </InstagramFollowGate>
    </div>
  );
}
