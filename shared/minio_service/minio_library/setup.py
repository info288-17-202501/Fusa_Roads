from setuptools import setup, find_packages

setup(
    name="fusa_minio_service",
    version="1.0.0",
    description="Servicio de funciones minio",
    author="Renato Atencio Aedo",
    author_email="renatoatencioaedo@gmail.com",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    install_requires=[
        "minio",
        "python-dotenv",
        "fastapi",
        "pydantic>=2.0",
        "pydantic-settings>=2.0"
    ],
    python_requires=">=3.7",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
