export default function FaqsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
      <div className="space-y-4 text-sm">
        <div>
          <div className="font-medium">How do I change my password?</div>
          <div>Go to Tutor Dashboard → Settings → Change Password.</div>
        </div>
        <div>
          <div className="font-medium">How do payouts work?</div>
          <div>View Tutor Dashboard → Earnings to request and view payout history.</div>
        </div>
        <div>
          <div className="font-medium">How do I report a user?</div>
          <div>Use Tutor Dashboard → Support to report a learner and submit tickets.</div>
        </div>
      </div>
    </div>
  );
}
