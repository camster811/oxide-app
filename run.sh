run_client(){
	cd client && bun run dev
}

run_api(){
	cd Oxide-Formula && source ./venv/Scripts/activate
	python3 main.py
}
run_client &
run_server &
