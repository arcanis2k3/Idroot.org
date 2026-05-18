def frontend_verification_complete(screenshot_path: str, additional_media_paths: list[str] | None = None) -> None:
    print(f"Verified: {screenshot_path}, media: {additional_media_paths}")

frontend_verification_complete(
    screenshot_path='/home/jules/verification/screenshots/verification.png',
    additional_media_paths=['/home/jules/verification/videos/aa50caa2e53884d03f24656c38276a1e.webm']
)
