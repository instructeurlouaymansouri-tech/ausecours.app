import ChatWindow from '@/components/ChatWindow';

export const metadata = { title: 'Chat · AUSECOURS' };

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-6">
      <ChatWindow />
    </div>
  );
}
