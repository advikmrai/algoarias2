import json
import os
import matplotlib.pyplot as plt
import argparse

def analyze_emotion_data(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Feature lists for plotting
    dominant_emotions = []
    genders = []
    features_data = {}
    arousal_values = []
    valence_values = []
    timestamps = []

    # Loop through JSON files in the directory
    json_files = [f for f in os.listdir(input_dir) if f.endswith('.json')]
    json_files.sort() # Sort files to ensure chronological order

    for filename in json_files:
        filepath = os.path.join(input_dir, filename)
        try:
            with open(filepath, 'r') as file:
                data = json.load(file)

                # Extract relevant data
                timestamps.append(data["camera"]["frameTimestamp"])
                dominant_emotions.append(data["face_emotion"]["dominantEmotion"])
                genders.append(data["face_gender"]["mostConfident"])
                
                #features
                for feature, value in data["face_features"]["features"].items():
                    if feature not in features_data:
                        features_data[feature] = []
                    features_data[feature].append(value)

                arousal_values.append(data["face_arousal_valence"]["arousal"])
                valence_values.append(data["face_arousal_valence"]["valence"])


        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error processing file {filename}: {e}")
            continue

    # Create and save graphs
    plt.figure(figsize=(10, 6))
    plt.plot(timestamps, dominant_emotions)
    plt.xlabel("Timestamp")
    plt.ylabel("Dominant Emotion")
    plt.title("Dominant Emotion Over Time")
    plt.savefig(os.path.join(output_dir, "dominant_emotion.png"))

    plt.figure(figsize=(10, 6))
    plt.plot(timestamps, genders)
    plt.xlabel("Timestamp")
    plt.ylabel("Gender")
    plt.title("Gender Over Time")
    plt.savefig(os.path.join(output_dir, "gender.png"))
    
    for feature, values in features_data.items():
        plt.figure(figsize=(10,6))
        plt.plot(timestamps, values)
        plt.xlabel("Timestamp")
        plt.ylabel(feature)
        plt.title(f"{feature} Over Time")
        plt.savefig(os.path.join(output_dir, f"{feature}.png"))

    plt.figure(figsize=(10, 6))
    plt.plot(timestamps, arousal_values, label="Arousal")
    plt.plot(timestamps, valence_values, label="Valence")
    plt.xlabel("Timestamp")
    plt.ylabel("Value")
    plt.title("Arousal and Valence Over Time")
    plt.legend()
    plt.savefig(os.path.join(output_dir, "arousal_valence.png"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input_dir", help="Input directory containing JSON files")
    parser.add_argument("output_dir", help="Output directory to save graphs")
    args = parser.parse_args()
    analyze_emotion_data(args.input_dir, args.output_dir)