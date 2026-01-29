create_deployment:
#kubectl apply -f frontend-config.yaml
	kubectl apply -f frontend.yml
build_image:
	docker build -t frontend .
get_service_ip:
	minikube service frontend-service
