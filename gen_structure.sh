#!/bin/bash

# Define the output file
OUTPUT_FILE="project_structure.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Function to print the directory structure
print_structure() {
  local dir="$1"
  local prefix="$2"
  local depth="$3"
  local max_depth="$4"
  
  # Skip node_modules, .git, and dist directories
  if [[ "$dir" == *"node_modules"* || "$dir" == *".git"* || "$dir" == *"dist"* ]]; then
    return
  fi
  
  # Check if we've reached the maximum depth
  if [[ "$max_depth" != "unlimited" && "$depth" -gt "$max_depth" ]]; then
    return
  fi
  
  # Get the list of files and directories
  local entries=($(ls -1A "$dir" 2>/dev/null | sort))
  
  for entry in "${entries[@]}"; do
    # Skip hidden files/directories if requested
    if [[ "$include_hidden" != "yes" && "$entry" == .* ]]; then
      continue
    fi
    
    local full_path="${dir}/${entry}"
    
    if [[ -d "$full_path" ]]; then
      # It's a directory
      echo "${prefix}└── ${entry}/" >> "$OUTPUT_FILE"
      print_structure "$full_path" "${prefix}    " $((depth + 1)) "$max_depth"
    else
      # It's a file
      echo "${prefix}└── ${entry}" >> "$OUTPUT_FILE"
    fi
  done
}

# Parse command line arguments
project_dir="."
max_depth="unlimited"
include_hidden="no"

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -d|--dir)
      project_dir="$2"
      shift
      ;;
    -m|--max-depth)
      max_depth="$2"
      shift
      ;;
    -h|--include-hidden)
      include_hidden="yes"
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
  shift
done

# Print the header
echo "Project Structure - $(basename $(realpath "$project_dir"))" >> "$OUTPUT_FILE"
echo "Generated on $(date)" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Start building the structure
echo "$(basename $(realpath "$project_dir"))/" >> "$OUTPUT_FILE"
print_structure "$project_dir" "    " 1 "$max_depth"

echo "" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "Structure visualization complete. Output saved to $OUTPUT_FILE"

# Display the generated structure
cat "$OUTPUT_FILE"
