output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.api.id
}

output "public_ip" {
  description = "Public IP address of the API host."
  value       = aws_eip.api.public_ip
}

output "public_dns" {
  description = "Public DNS name of the API host."
  value       = aws_instance.api.public_dns
}

output "ssh_command" {
  description = "Example SSH command for the EC2 host."
  value       = "ssh -i /path/to/key.pem ec2-user@${aws_eip.api.public_ip}"
}
