"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: (error: Error, retry: () => void) => ReactNode; children: ReactNode };
type State = { error: Error | null };

/** Keeps a WebGL or asset failure inside the 3D area instead of breaking the page. */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[ESTATEVERSE] 3D scene failed", error);
  }

  retry = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback(this.state.error, this.retry) : this.props.children;
  }
}
