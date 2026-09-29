export default function SourceCredit({ sourceName, sourceUrl }: { sourceName: string; sourceUrl: string }) {
	return <small><a href={sourceUrl}>{sourceName}</a></small>;
}
