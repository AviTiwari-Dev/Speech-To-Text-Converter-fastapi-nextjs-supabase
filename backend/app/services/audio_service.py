from pydub import AudioSegment


def convert_audio(input_path):

    output_path = input_path.replace(".webm", ".wav")

    audio = AudioSegment.from_file(input_path)

    audio = audio.set_frame_rate(16000).set_channels(1)

    audio.export(output_path, format="wav")

    return output_path
