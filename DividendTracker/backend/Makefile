create_pod:
	kubectl apply -f backend-config.yaml
	kubectl apply -f backend-secret.yaml
	kubectl apply -f backend.yml
build_image:
	docker build -t backend .
get_pod_ip:
	minikube service backend-service
